import { useState, useEffect } from 'react';
import { ticketService } from '@/services/ticketService';
import type { TicketListView } from '@/lib/supabaseTypes';

export function useTickets() {
  const [tickets, setTickets] = useState<TicketListView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ticketService.getAllTickets();
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const searchTickets = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ticketService.searchTickets(query);
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search tickets');
    } finally {
      setLoading(false);
    }
  };

  const filterByStatus = async (status: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ticketService.filterTicketsByStatus(status);
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter tickets');
    } finally {
      setLoading(false);
    }
  };

  return {
    tickets,
    loading,
    error,
    refetch: fetchTickets,
    searchTickets,
    filterByStatus
  };
}

export function useCustomerTickets(email: string) {
  const [tickets, setTickets] = useState<TicketListView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    if (!email) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await ticketService.getTicketsByCustomer(email);
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [email]);

  return {
    tickets,
    loading,
    error,
    refetch: fetchTickets
  };
}