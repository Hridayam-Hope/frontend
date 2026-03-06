'use client';

import { useEffect, useState, useMemo, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useFinanceStore } from '@/lib/stores/finance';
import { useToast } from '@/lib/toast';
import { useApiError } from '@/lib/hooks/useApiError';
import DataTable, { type Column } from '@/components/ui/DataTable';
import Pagination from '@/components/ui/Pagination';
import StatCard from '@/components/ui/StatCard';
import Button from '@/components/ui/Button';
import DonationForm from '@/components/finance/DonationForm';
import BulkDonationForm from '@/components/finance/BulkDonationForm';
import type { VolunteerDonationListItem } from '@/types/api';

const PAYMENT_LABELS: Record<string, string> = {
	upi: 'UPI',
	cash: 'Cash',
	bank_transfer: 'Bank Transfer',
	other: 'Other',
};

export default function FinanceLayout({ children }: { children: ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const { showToast } = useToast();
	const { handleError } = useApiError();

	const { donations, total, page, totalPages, listLoading, fetchDonations, summary, fetchSummary, createDonation, bulkCreate } =
		useFinanceStore();

	const [showForm, setShowForm] = useState(false);
	const [showBulkForm, setShowBulkForm] = useState(false);

	// Filters
	const [search, setSearch] = useState('');
	const [paymentFilter, setPaymentFilter] = useState('');
	const [dateFrom, setDateFrom] = useState('');
	const [dateTo, setDateTo] = useState('');

	// Extract selected donation ID from URL for row highlighting
	const selectedDonationId = useMemo(() => {
		const match = pathname.match(/\/admin\/finance\/(\d+)/);
		return match ? parseInt(match[1], 10) : null;
	}, [pathname]);

	useEffect(() => {
		fetchDonations();
		fetchSummary();
	}, [fetchDonations, fetchSummary]);

	function applyFilters(overrides: Record<string, unknown> = {}) {
		fetchDonations({
			page: 1,
			search: search || undefined,
			payment_method: paymentFilter || undefined,
			date_from: dateFrom || undefined,
			date_to: dateTo || undefined,
			...overrides,
		});
	}

	function handlePaymentFilter(method: string) {
		setPaymentFilter(method);
		fetchDonations({
			page: 1,
			search: search || undefined,
			payment_method: method || undefined,
			date_from: dateFrom || undefined,
			date_to: dateTo || undefined,
		});
	}

	const columns: Column<VolunteerDonationListItem>[] = [
		{ key: 'volunteer_name', label: 'Volunteer' },
		{
			key: 'amount',
			label: 'Amount',
			render: (item) => <span className="font-semibold text-gray-900">₹{item.amount.toLocaleString()}</span>,
		},
		{
			key: 'date',
			label: 'Date',
			render: (item) =>
				new Date(item.date).toLocaleDateString('en-IN', {
					day: 'numeric',
					month: 'short',
					year: 'numeric',
				}),
		},
		{
			key: 'payment_method',
			label: 'Method',
			render: (item) => (
				<span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
					{PAYMENT_LABELS[item.payment_method] || item.payment_method}
				</span>
			),
		},
		{
			key: 'recorded_by_email',
			label: 'Recorded By',
			render: (item) => <span className="text-gray-500 text-xs">{item.recorded_by_email}</span>,
		},
		{
			key: 'created_at',
			label: 'Added',
			render: (item) => new Date(item.created_at).toLocaleDateString('en-IN'),
		},
	];

	return (
		<>
			<div>
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">Volunteer Donations</h1>
						<p className="text-gray-500 mt-1">{total} donation records</p>
					</div>
					<div className="flex gap-2">
						<Button
							variant="secondary"
							onClick={() => {
								setShowBulkForm(!showBulkForm);
								setShowForm(false);
							}}
						>
							Bulk Add
						</Button>
						<Button
							onClick={() => {
								setShowForm(!showForm);
								setShowBulkForm(false);
							}}
						>
							Add Donation
						</Button>
					</div>
				</div>

				{/* Stats */}
				{summary && (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
						<StatCard label="Total Collected" value={`₹${summary.total_amount.toLocaleString()}`} color="from-brand-400 to-brand-500" />
						<StatCard label="This Month" value={`₹${summary.this_month_amount.toLocaleString()}`} color="from-emerald-400 to-emerald-500" />
						<StatCard label="Total Records" value={summary.total_count} color="from-accent-400 to-accent-500" />
						<StatCard label="This Month" value={`${summary.this_month_count} donations`} color="from-amber-400 to-amber-500" />
					</div>
				)}

				{/* Add Donation Form */}
				{showForm && (
					<div className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">Add Donation</h2>
						<DonationForm
							onSubmit={async (data) => {
								try {
									await createDonation(data);
									showToast('success', 'Donation recorded successfully');
									setShowForm(false);
								} catch (err) {
									handleError(err, 'Failed to record donation');
								}
							}}
							onCancel={() => setShowForm(false)}
						/>
					</div>
				)}

				{/* Bulk Add Form */}
				{showBulkForm && (
					<div className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">Bulk Add Donations</h2>
						<BulkDonationForm
							onSubmit={async (donations) => {
								try {
									const result = await bulkCreate(donations);
									if (result.failed > 0) {
										showToast('warning', `${result.created} added, ${result.failed} failed`);
									} else {
										showToast('success', `${result.created} donations recorded successfully`);
									}
									setShowBulkForm(false);
								} catch (err) {
									handleError(err, 'Failed to record donations');
								}
							}}
							onCancel={() => setShowBulkForm(false)}
						/>
					</div>
				)}

				{/* Filters */}
				<div className="flex flex-wrap items-end gap-3 mt-6 mb-4">
					{/* Search */}
					<div className="flex-1 min-w-[200px] max-w-sm">
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
							placeholder="Search volunteer name, email..."
							className="block w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
						/>
					</div>

					{/* Date range */}
					<div className="flex items-center gap-2">
						<input
							type="date"
							value={dateFrom}
							onChange={(e) => setDateFrom(e.target.value)}
							className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
						/>
						<span className="text-gray-400 text-sm">to</span>
						<input
							type="date"
							value={dateTo}
							onChange={(e) => setDateTo(e.target.value)}
							className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
						/>
					</div>

					<Button variant="secondary" size="sm" onClick={() => applyFilters()}>
						Apply
					</Button>

					{(search || paymentFilter || dateFrom || dateTo) && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								setSearch('');
								setPaymentFilter('');
								setDateFrom('');
								setDateTo('');
								fetchDonations({ page: 1 });
							}}
						>
							Clear
						</Button>
					)}
				</div>

				{/* Payment method chips */}
				<div className="flex gap-2 mb-4">
					{[
						{ value: '', label: 'All' },
						{ value: 'upi', label: 'UPI' },
						{ value: 'cash', label: 'Cash' },
						{ value: 'bank_transfer', label: 'Bank Transfer' },
						{ value: 'other', label: 'Other' },
					].map((m) => (
						<button
							key={m.value}
							onClick={() => handlePaymentFilter(m.value)}
							className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
								paymentFilter === m.value ? 'bg-brand-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
							}`}
						>
							{m.label}
						</button>
					))}
				</div>

				{/* Table */}
				<DataTable
					columns={columns}
					data={donations}
					loading={listLoading}
					selectedRowId={selectedDonationId}
					onRowClick={(item) => router.push(`/admin/finance/${item.id}`)}
					emptyMessage="No volunteer donations found"
				/>

				<Pagination
					page={page}
					totalPages={totalPages}
					total={total}
					onPageChange={(p) =>
						fetchDonations({
							page: p,
							search: search || undefined,
							payment_method: paymentFilter || undefined,
							date_from: dateFrom || undefined,
							date_to: dateTo || undefined,
						})
					}
				/>

				{/* Top Contributors */}
				{summary && summary.top_volunteers.length > 0 && (
					<div className="mt-8 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">Top Contributors</h2>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b border-gray-100">
										<th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
										<th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Volunteer</th>
										<th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
										<th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase">Total</th>
										<th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase">Count</th>
										<th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase">Last</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-50">
									{summary.top_volunteers.map((v, i) => (
										<tr key={v.volunteer_id} className="hover:bg-gray-50/50">
											<td className="px-4 py-2 text-sm text-gray-400">{i + 1}</td>
											<td className="px-4 py-2 text-sm font-medium text-gray-900">{v.volunteer_name}</td>
											<td className="px-4 py-2">
												<span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 capitalize">
													{v.volunteer_role.replace('_', ' ')}
												</span>
											</td>
											<td className="px-4 py-2 text-sm font-semibold text-gray-900 text-right">₹{v.total_amount.toLocaleString()}</td>
											<td className="px-4 py-2 text-sm text-gray-500 text-right">{v.donation_count}</td>
											<td className="px-4 py-2 text-sm text-gray-500 text-right">
												{v.last_donation_date
													? new Date(v.last_donation_date).toLocaleDateString('en-IN', {
															day: 'numeric',
															month: 'short',
														})
													: ' - '}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}

				{/* Monthly Breakdown */}
				{summary && summary.month_wise.length > 0 && (
					<div className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Breakdown</h2>
						<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
							{summary.month_wise.map((m) => {
								const monthName = new Date(m.year, m.month - 1).toLocaleDateString('en-IN', {
									month: 'short',
									year: '2-digit',
								});
								return (
									<div key={`${m.year}-${m.month}`} className="text-center p-3 rounded-lg bg-gray-50">
										<p className="text-xs text-gray-500 uppercase">{monthName}</p>
										<p className="text-lg font-bold text-gray-900 mt-1">₹{m.total.toLocaleString()}</p>
										<p className="text-xs text-gray-400">
											{m.count} donation{m.count !== 1 ? 's' : ''}
										</p>
									</div>
								);
							})}
						</div>
					</div>
				)}
			</div>

			{/* Sidebar slot  -  rendered by [id]/page.tsx or null by page.tsx */}
			{children}
		</>
	);
}
