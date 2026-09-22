import { doc, setDoc, serverTimestamp, getDocs, collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { handleFirestoreError, OperationType } from '../firebase/errors';

export interface PaymentRecord {
  id: string;
  orderId: string;
  gateway: 'razorpay' | 'paytm';
  amount: number;
  currency: 'INR';
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  purpose: string;
  status: 'completed' | 'pending' | 'failed';
  transactionId: string;
  createdAt?: Timestamp | any;
}

export interface PaymentGatewayConfig {
  razorpay: {
    keyId: string;
    isConfigured: boolean;
    sandbox: boolean;
  };
  paytm: {
    mid: string;
    isConfigured: boolean;
    sandbox: boolean;
    upiVpa: string;
  };
}

const PAYMENTS_COLLECTION = 'payments';

// Load public configuration for Razorpay and Paytm
export async function getPaymentConfig(): Promise<PaymentGatewayConfig> {
  try {
    const res = await fetch('/api/payment/config');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Failed to load gateway config, using local fallbacks', e);
  }
  return {
    razorpay: {
      keyId: 'rzp_test_kamalOjhaDev',
      isConfigured: false,
      sandbox: true,
    },
    paytm: {
      mid: 'KAMAL_PAYTM_MERCHANT_DEV',
      isConfigured: false,
      sandbox: true,
      upiVpa: 'kamal19ojha@paytm',
    },
  };
}

// Persist verified transaction record in Firebase Firestore
export async function recordPaymentInFirestore(data: {
  orderId: string;
  gateway: 'razorpay' | 'paytm';
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  purpose: string;
  transactionId: string;
  status?: 'completed' | 'pending' | 'failed';
}): Promise<string> {
  const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const path = `${PAYMENTS_COLLECTION}/${paymentId}`;

  try {
    const docRef = doc(db, PAYMENTS_COLLECTION, paymentId);
    await setDoc(docRef, {
      orderId: data.orderId,
      gateway: data.gateway,
      amount: Math.round(data.amount),
      currency: 'INR',
      customerName: data.customerName.trim().substring(0, 100),
      customerEmail: data.customerEmail.trim().toLowerCase().substring(0, 150),
      ...(data.customerPhone ? { customerPhone: data.customerPhone.trim().substring(0, 20) } : {}),
      purpose: data.purpose.trim().substring(0, 200),
      status: data.status || 'completed',
      transactionId: data.transactionId,
      createdAt: serverTimestamp(),
    });
    return paymentId;
  } catch (error) {
    return handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Query payments (Admin only)
export async function fetchRecentPayments(): Promise<PaymentRecord[]> {
  const path = PAYMENTS_COLLECTION;
  try {
    const q = query(collection(db, PAYMENTS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as PaymentRecord[];
  } catch (error) {
    return handleFirestoreError(error, OperationType.LIST, path);
  }
}

// Razorpay SDK Script Loader
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Official Razorpay SDK script failed to load, sandbox mode will be active.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}
