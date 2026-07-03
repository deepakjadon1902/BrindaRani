import { useEffect, useState } from 'react';
import { ExternalLink, Search, Truck } from 'lucide-react';
import { ordersAPI } from '@/services/api';
import { useStore } from '@/store/useStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { Order } from '@/data/mockData';

const courierOptions = ['DTDC', 'Ekart', 'Delhivery', 'Blue Dart', 'India Post', 'XpressBees', 'Ecom Express', 'Shadowfax', 'Other'];
const shipmentStatuses: Order['status'][] = ['confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'returned'];
const label = (value: string) => value.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const AdminShipments = () => {
  const { orders, fetchOrders } = useStore();
  const [query, setQuery] = useState('');
  const [drafts, setDrafts] = useState<Record<string, Record<string, string>>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  const filtered = orders.filter((o) => `${o.orderCode} ${o.userName} ${o.trackingId}`.toLowerCase().includes(query.toLowerCase()));
  const field = (order: Order, name: string) => drafts[order.id]?.[name] ?? String((order as unknown as Record<string, unknown>)[name] || '');
  const setField = (id: string, name: string, value: string) => setDrafts((d) => ({ ...d, [id]: { ...d[id], [name]: value } }));
  const save = async (order: Order) => {
    setSavingId(order.id);
    const payload = {
      courierPartner: field(order, 'courierPartner'),
      trackingId: field(order, 'trackingId'),
      trackingUrl: field(order, 'trackingUrl'),
      estimatedDelivery: field(order, 'estimatedDelivery').slice(0, 10),
      status: field(order, 'status') || order.status,
    };
    try {
      await ordersAPI.updateShipment(order.id, payload);
      setDrafts((current) => { const next = { ...current }; delete next[order.id]; return next; });
      await fetchOrders();
      toast.success('Shipment saved in database and customer notified');
    } catch (error) {
      toast.error('Could not save shipment', { description: error instanceof Error ? error.message : 'Please try again' });
    } finally { setSavingId(null); }
  };

  return <div className="space-y-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-bold">Shipments</h1><p className="text-sm text-muted-foreground">Assign courier AWBs and maintain live fulfilment milestones</p></div><div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"/><Input className="pl-9 w-72" placeholder="Order, customer or tracking ID" value={query} onChange={(e) => setQuery(e.target.value)}/></div></div>
    <div className="space-y-4">{filtered.map((order) => <div key={order.id} className="admin-card p-5"><div className="flex flex-wrap items-center justify-between gap-3 mb-5"><div><p className="font-bold">#{order.orderCode || order.id.slice(-8)} · {order.userName}</p><p className="text-sm text-muted-foreground">{order.items.length} items · ₹{order.total.toLocaleString('en-IN')} · {label(order.status)}</p></div>{order.trackingUrl && <Button asChild variant="outline" size="sm"><a href={order.trackingUrl} target="_blank" rel="noreferrer">Track <ExternalLink className="ml-2 h-4 w-4"/></a></Button>}</div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6"><div><Label>Courier partner</Label><Select value={field(order, 'courierPartner')} onValueChange={(v) => setField(order.id, 'courierPartner', v)}><SelectTrigger className="mt-1"><SelectValue placeholder="Select courier"/></SelectTrigger><SelectContent>{courierOptions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div><div><Label>Tracking / AWB ID</Label><Input className="mt-1" value={field(order, 'trackingId')} onChange={(e) => setField(order.id, 'trackingId', e.target.value)}/></div><div><Label>Tracking URL</Label><Input className="mt-1" value={field(order, 'trackingUrl')} onChange={(e) => setField(order.id, 'trackingUrl', e.target.value)}/></div><div><Label>Expected delivery</Label><Input type="date" className="mt-1" value={field(order, 'estimatedDelivery').slice(0,10)} onChange={(e) => setField(order.id, 'estimatedDelivery', e.target.value)}/></div><div><Label>Shipment status</Label><Select value={field(order, 'status') || order.status} onValueChange={(v) => setField(order.id, 'status', v)}><SelectTrigger className="mt-1"><SelectValue/></SelectTrigger><SelectContent>{order.status === 'paid' && <SelectItem value="paid">Paid</SelectItem>}{shipmentStatuses.map((s) => <SelectItem key={s} value={s}>{label(s)}</SelectItem>)}</SelectContent></Select></div><div className="flex items-end"><Button className="w-full" onClick={() => save(order)} disabled={savingId === order.id}><Truck className="mr-2 h-4 w-4"/>{savingId === order.id ? 'Saving…' : 'Save update'}</Button></div></div>
    </div>)}{filtered.length === 0 && <div className="admin-card p-10 text-center text-muted-foreground">No shipments found</div>}</div>
  </div>;
};
export default AdminShipments;
