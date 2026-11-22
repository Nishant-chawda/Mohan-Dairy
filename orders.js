import { supabase } from './supabase-client.js';

/**
 * Save a customer's profile (name/phone/address/email).
 * Call this from your "My Account" save step.
 */
export async function saveCustomer({ name, phone, address, email }) {
  const { data, error } = await supabase
    .from('customers')
    .insert([{ name, phone, address, email }])
    .select()
    .single();

  if (error) throw error;
  return data; // { id, name, phone, address, email, created_at }
}

/**
 * Submit a cart checkout as one order.
 * items: [{ name, size, qty, price }]
 */
export async function submitOrder({ customerId, name, phone, address, items, total }) {
  const { data, error } = await supabase
    .from('orders')
    .insert([{
      customer_id: customerId || null,
      name,
      phone,
      address,
      items,
      total,
      status: 'new',
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Owner-side: fetch new orders, newest first.
 * Only works once the owner is signed in via Supabase Auth (see README) —
 * the RLS policy in schema.sql blocks this for anonymous visitors.
 */
export async function fetchNewOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('status', 'new')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Owner-side: mark an order done.
 */
export async function markOrderDone(orderId) {
  const { error } = await supabase
    .from('orders')
    .update({ status: 'done' })
    .eq('id', orderId);

  if (error) throw error;
}

/**
 * Owner-side: listen for new orders in real time (optional).
 * Call unsubscribe() when you're done (e.g. when leaving the page).
 */
export function subscribeToNewOrders(onNewOrder) {
  const channel = supabase
    .channel('orders-inserts')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'orders' },
      (payload) => onNewOrder(payload.new)
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}
