import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
    phone?: string;
    address?: string;
    isAdmin?: boolean;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      phone?: string;
      address?: string;
      isAdmin: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    phone?: string;
    address?: string;
  }
}
