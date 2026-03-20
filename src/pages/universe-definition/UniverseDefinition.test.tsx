import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/setup';
import { UniverseDefinition } from './UniverseDefinition';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export function renderWithClient(ui: React.ReactElement) {
  const testQueryClient = createTestQueryClient();
  const { rerender, ...result } = render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
  );
  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(
        <QueryClientProvider client={testQueryClient}>{rerenderUi}</QueryClientProvider>
      ),
  };
}

const mockData = [
  {
    id: "1",
    date: "2026-03-20T11:39:16.895Z",
    service: "equity_vanilla_option",
    region: "HKG",
    submittedBy: "Theodore Duncan",
    canUploadSUD: true
  },
  {
    id: "2",
    date: "2025-12-15T15:17:00.000Z",
    service: "equity_forward_ndf",
    region: "SGP",
    submittedBy: "Declan O'Connell",
    canUploadSUD: false
  }
];

describe('UniverseDefinition component', () => {
  it('renders loading state initially', () => {
    server.use(
      http.get('http://localhost:3000/universeDefinitions', () => {
        return new Promise(() => {}); // never resolves to keep in loading state
      })
    );
    
    renderWithClient(<UniverseDefinition />);
    expect(screen.getByText(/Loading data.../i)).toBeInTheDocument();
  });

  it('renders empty state when data is empty', async () => {
    server.use(
      http.get('http://localhost:3000/universeDefinitions', () => {
        return HttpResponse.json([]);
      })
    );

    renderWithClient(<UniverseDefinition />);
    
    await waitFor(() => {
      expect(screen.getByText(/No universe definitions yet/i)).toBeInTheDocument();
    });
    
    expect(screen.getByRole('button', { name: /Upload SUD/i })).toBeInTheDocument();
  });

  it('renders table data when data is successfully fetched', async () => {
    server.use(
      http.get('http://localhost:3000/universeDefinitions', () => {
        return HttpResponse.json(mockData);
      })
    );

    renderWithClient(<UniverseDefinition />);
    
    await waitFor(() => {
      expect(screen.getByText('equity_vanilla_option')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Theodore Duncan')).toBeInTheDocument();
    expect(screen.getByText('equity_forward_ndf')).toBeInTheDocument();
    expect(screen.getByText(/Upload new version\(s\)/i)).toBeInTheDocument();
  });

  it('renders error state on fetch failure', async () => {
    server.use(
      http.get('http://localhost:3000/universeDefinitions', () => {
        return new HttpResponse(null, { status: 500, statusText: "Internal Server Error" });
      })
    );

    renderWithClient(<UniverseDefinition />);
    
    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to fetch data/i)).toBeInTheDocument();
    });
  });

  it('filters table data', async () => {
    server.use(
      http.get('http://localhost:3000/universeDefinitions', () => {
        return HttpResponse.json(mockData);
      })
    );

    renderWithClient(<UniverseDefinition />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('equity_vanilla_option')).toBeInTheDocument();
    });

    const filterInput = screen.getByPlaceholderText('Filter name');
    await userEvent.type(filterInput, 'Declan');

    // Mstf (equity_forward_ndf) should still be there
    expect(screen.getByText('equity_forward_ndf')).toBeInTheDocument();
    
    // The other row should be filtered out
    expect(screen.queryByText(' equity_vanilla_option')).not.toBeInTheDocument();
  });
});
