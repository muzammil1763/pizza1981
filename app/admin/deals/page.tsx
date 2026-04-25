'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Tag, TrendingDown, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface Deal {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  image?: string;
  items: string[];
  available: boolean;
}

export default function AdminDealsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    originalPrice: '',
    discountedPrice: '',
    image: '',
    items: '',
    available: true,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [session, status, router]);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const res = await fetch('/api/admin/deals');
      if (res.ok) {
        const data = await res.json();
        setDeals(data);
      }
    } catch (error) {
      toast.error('Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, image: data.url }));
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      toast.error('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const originalPrice = parseFloat(formData.originalPrice);
    const discountedPrice = parseFloat(formData.discountedPrice);
    const discountPercentage = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);

    const dealData = {
      name: formData.name,
      description: formData.description,
      originalPrice,
      discountedPrice,
      discountPercentage,
      image: formData.image || null,
      items: formData.items.split(',').map(item => item.trim()).filter(Boolean),
      available: formData.available,
    };

    try {
      const url = editingDeal ? `/api/admin/deals/${editingDeal.id}` : '/api/admin/deals';
      const method = editingDeal ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dealData),
      });

      if (res.ok) {
        toast.success(editingDeal ? 'Deal updated successfully' : 'Deal created successfully');
        setDialogOpen(false);
        resetForm();
        fetchDeals();
      } else {
        toast.error('Failed to save deal');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleEdit = (deal: Deal) => {
    setEditingDeal(deal);
    setFormData({
      name: deal.name,
      description: deal.description,
      originalPrice: deal.originalPrice.toString(),
      discountedPrice: deal.discountedPrice.toString(),
      image: deal.image || '',
      items: deal.items.join(', '),
      available: deal.available,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) return;

    try {
      const res = await fetch(`/api/admin/deals/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Deal deleted successfully');
        fetchDeals();
      } else {
        toast.error('Failed to delete deal');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      originalPrice: '',
      discountedPrice: '',
      image: '',
      items: '',
      available: true,
    });
    setEditingDeal(null);
  };

  if (status === 'loading' || loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session?.user || session.user.role !== 'ADMIN') {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Deals Management</h1>
            <p className="text-gray-500 mt-1">Manage combo deals and special offers</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-[#f5a623] hover:bg-[#e09510]">
                <Plus size={16} className="mr-2" />
                Add Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingDeal ? 'Edit Deal' : 'Add New Deal'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Deal Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Family Deal"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Deal details"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="originalPrice">Original Price (Rs.)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      placeholder="3000"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="discountedPrice">Discounted Price (Rs.)</Label>
                    <Input
                      id="discountedPrice"
                      type="number"
                      step="0.01"
                      value={formData.discountedPrice}
                      onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                      placeholder="1999"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="items">Items (comma-separated)</Label>
                  <Input
                    id="items"
                    value={formData.items}
                    onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                    placeholder="2 Large Pizzas, 4 Drinks, Fries"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="image">Deal Image</Label>
                  <div className="mt-2 space-y-3">
                    {formData.image && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                        <Image src={formData.image} alt="Deal preview" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: '' })}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="flex-1"
                      />
                      {uploading && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="w-4 h-4 border-2 border-[#f5a623] border-t-transparent rounded-full animate-spin"></div>
                          Uploading...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="available"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="available">Available</Label>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-[#f5a623] hover:bg-[#e09510]" disabled={uploading}>
                    {editingDeal ? 'Update Deal' : 'Create Deal'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <Card key={deal.id} className="overflow-hidden">
              {deal.image && (
                <div className="relative w-full h-48">
                  <Image src={deal.image} alt={deal.name} fill className="object-cover" />
                </div>
              )}
              <CardHeader className="bg-gradient-to-br from-[#1e3a5f]/5 to-[#f5a623]/5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{deal.name}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{deal.description}</p>
                  </div>
                  <Badge variant={deal.available ? 'default' : 'secondary'} className="ml-2">
                    {deal.available ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 line-through">Rs. {deal.originalPrice}</p>
                      <p className="text-2xl font-bold text-[#f5a623]">Rs. {deal.discountedPrice}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      <TrendingDown size={12} className="mr-1" />
                      {deal.discountPercentage}% OFF
                    </Badge>
                  </div>
                  
                  <div className="border-t pt-3">
                    <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      <Tag size={12} />
                      Includes:
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {deal.items.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1">
                          <span className="text-[#f5a623]">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2 pt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEdit(deal)}
                    >
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(deal.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {deals.length === 0 && !loading && (
          <Card className="p-12 text-center">
            <Tag size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No deals yet</h3>
            <p className="text-gray-500 mb-4">Create your first combo deal to get started</p>
            <Button onClick={() => setDialogOpen(true)} className="bg-[#f5a623] hover:bg-[#e09510]">
              <Plus size={16} className="mr-2" />
              Add First Deal
            </Button>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
