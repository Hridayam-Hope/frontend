'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { confirmSubscriptionByToken } from '@/lib/api/newsletter';
import { ApiError } from '@/lib/api/client';

type ConfirmState = 'loading' | 'success' | 'error';

interface PageProps {
  params: { token: string };
}

export default function NewsletterConfirmPathPage({ params }: PageProps) {
  const [token, setToken] = useState('');
  const [state, setState] = useState<ConfirmState>('loading');
  const [message, setMessage] = useState('Confirming your subscription...');

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      const resolvedToken = decodeURIComponent(params.token || '').trim();
      setToken(resolvedToken);

      if (!resolvedToken) {
        setState('error');
        setMessage('Missing confirmation token. Please use the full link from your email.');
        return;
      }

      try {
        const response = await confirmSubscriptionByToken(resolvedToken);
        if (!mounted) return;
        setState('success');
        setMessage(response.message || 'Subscription confirmed successfully.');
      } catch (error) {
        if (!mounted) return;
        setState('error');
        if (error instanceof ApiError) {
          setMessage(error.message || 'Unable to confirm this subscription link.');
        } else {
          setMessage('Something went wrong while confirming your subscription.');
        }
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [params.token]);

  const title = useMemo(() => {
    if (state === 'success') return 'Subscription Confirmed';
    if (state === 'error') return 'Confirmation Failed';
    return 'Processing Confirmation';
  }, [state]);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Newsletter</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{title}</h1>
          <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">{message}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="inline-flex items-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800">
              Back to Home
            </Link>
            <Link href="/join-us" className="inline-flex items-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
              Explore Opportunities
            </Link>
          </div>

          {token && <p className="mt-8 text-xs text-gray-400">Ref: {token.slice(0, 8)}...</p>}
        </div>
      </section>
      <Footer />
    </main>
  );
}
