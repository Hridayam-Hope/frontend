'use client';

import { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { unsubscribeByToken } from '@/lib/api/newsletter';
import { ApiError } from '@/lib/api/client';

type UnsubscribeState = 'loading' | 'success' | 'error';

interface PageProps {
  params: Promise<{ token: string }>;
}

export default function NewsletterUnsubscribePage({ params }: PageProps) {
  const { token: routeToken } = use(params);
  const [token, setToken] = useState<string>('');
  const [state, setState] = useState<UnsubscribeState>('loading');
  const [message, setMessage] = useState<string>('Unsubscribing you from newsletter updates...');

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      const resolvedToken = decodeURIComponent(routeToken || '').trim();
      setToken(resolvedToken);

      if (!resolvedToken) {
        setState('error');
        setMessage('Missing unsubscribe token. Please use the full link from your email.');
        return;
      }

      if (resolvedToken === 'preview-token') {
        setState('error');
        setMessage('This is a preview/test unsubscribe link. Please use the unsubscribe link from an actual newsletter email.');
        return;
      }

      try {
        const response = await unsubscribeByToken(resolvedToken);
        if (!mounted) return;
        setState('success');
        setMessage(response.message || 'You have been unsubscribed successfully.');
      } catch (error) {
        if (!mounted) return;

        if (error instanceof ApiError) {
          setMessage(error.message || 'Unable to unsubscribe with this link.');
        } else {
          setMessage('Something went wrong while processing your unsubscribe request.');
        }
        setState('error');
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, [routeToken]);

  const statusTitle = useMemo(() => {
    if (state === 'success') return 'You are unsubscribed';
    if (state === 'error') return 'Unable to unsubscribe';
    return 'Processing request';
  }, [state]);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Newsletter</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{statusTitle}</h1>
          <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">{message}</p>

          {state === 'loading' && (
            <p className="mt-6 text-sm text-gray-500">Please wait. This usually takes a second.</p>
          )}

          {state !== 'loading' && (
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Back to Home
              </Link>
              <Link
                href="/join-us"
                className="inline-flex items-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Explore Opportunities
              </Link>
            </div>
          )}

          {token && (
            <p className="mt-8 text-xs text-gray-400">
              Ref: {token.slice(0, 8)}...
            </p>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
