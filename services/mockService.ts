import { INITIAL_BINS, INITIAL_PICKUPS, INITIAL_ROUTES, INITIAL_TRUCKS } from '../constants';
import { Bin, PickupRequest, Route, Truck } from '../types';

// Simulating API latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class MockService {
  private pickups: PickupRequest[] = [...INITIAL_PICKUPS];
  private trucks: Truck[] = [...INITIAL_TRUCKS];
  private bins: Bin[] = [...INITIAL_BINS];
  private routes: Route[] = [...INITIAL_ROUTES];

  async getPickups(): Promise<PickupRequest[]> {
    await delay(600);
    return [...this.pickups];
  }

  async updatePickupStatus(id: string, status: PickupRequest['status']): Promise<PickupRequest> {
    await delay(400);
    const index = this.pickups.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Pickup not found');
    
    const updated = { ...this.pickups[index], status };
    if (status === 'COMPLETED') {
      updated.completedAt = new Date().toISOString();
    }
    this.pickups[index] = updated;
    return updated;
  }

  async getTrucks(): Promise<Truck[]> {
    await delay(300);
    // Simulate movement for realism
    this.trucks = this.trucks.map(t => {
      if (t.status === 'EN_ROUTE') {
        return {
            ...t,
            location: {
                x: Math.max(0, Math.min(1000, t.location.x + (Math.random() - 0.5) * 20)),
                y: Math.max(0, Math.min(600, t.location.y + (Math.random() - 0.5) * 20))
            },
            fuelLevel: Math.max(0, t.fuelLevel - 0.1)
        };
      }
      return t;
    });
    return [...this.trucks];
  }

  async getBins(): Promise<Bin[]> {
    await delay(500);
    return [...this.bins];
  }

  async getRoutes(): Promise<Route[]> {
    await delay(400);
    return [...this.routes];
  }

  async getStats() {
    await delay(600);
    return {
      totalPickups: this.pickups.length,
      activeTrucks: this.trucks.filter(t => t.status === 'EN_ROUTE').length,
      criticalBins: this.bins.filter(b => b.fillLevel > 80).length,
      pendingRequests: this.pickups.filter(p => p.status === 'REQUESTED').length
    };
  }
}

export const api = new MockService();
