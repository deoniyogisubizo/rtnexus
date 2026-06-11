import { Product } from '../types';

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
    }
  }
  return dp[m][n];
}

export interface SearchResultItem {
  type: 'category' | 'product';
  label: string;
  product: Product;
}

export interface SearchResults {
  results: SearchResultItem[];
  suggestion: string | null;
}

export function searchAll(query: string, allProducts: Product[] = []): SearchResults {
  const q = query.toLowerCase().trim();
  if (!q) return { results: [], suggestion: null };

  const seenCategories = new Set<string>();
  const results: SearchResultItem[] = [];

  for (const product of allProducts) {
    const catMatch = !seenCategories.has(product.category) && product.category.toLowerCase().includes(q);
    const prodMatch = product.name.toLowerCase().includes(q);

    if (catMatch) {
      seenCategories.add(product.category);
      results.push({ type: 'category', label: product.category, product });
    }
    if (prodMatch) {
      results.push({ type: 'product', label: product.name, product });
    }
  }

  let suggestion: string | null = null;
  if (results.length === 0) {
    const allNames = [
      ...new Set([
        ...allProducts.map(p => p.name.toLowerCase()),
        ...allProducts.map(p => p.category.toLowerCase()),
      ]),
    ];
    let bestDist = Infinity;
    let best = '';
    for (const name of allNames) {
      const dist = levenshtein(q, name);
      if (dist < bestDist && dist <= 3) {
        bestDist = dist;
        best = name;
      }
    }
    if (best) suggestion = best;
  }

  return { results, suggestion };
}
