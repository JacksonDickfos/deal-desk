import { Deal, Owner, Product } from '@/types';

const OWNERS: Owner[] = ['Hasan', 'Jared', 'Guillermo', 'Ricardo', 'Kamran'];
const PRODUCTS: Product[] = ['Kayako', 'Influitive', 'Agents', 'CRMagic', 'Ephor', 'AI Caller'];

export function parseDealInput(input: string): Partial<Deal> {
  const words = input.split(' ');
  const result: Partial<Deal> = {
    company: '',
    amount: 0,
    owner: undefined,
    product: undefined,
    stage: "Demo'd",
    updatedAt: new Date()
  };

  // Find owner
  for (const word of words) {
    if (OWNERS.includes(word as Owner)) {
      result.owner = word as Owner;
      break;
    }
  }

  // Find product
  for (const word of words) {
    if (PRODUCTS.includes(word as Product)) {
      result.product = word as Product;
      break;
    }
  }

  // Find amount
  const amountMatch = input.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
  if (amountMatch) {
    result.amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  }

  // The rest is the deal name
  const nameParts = words.filter(word => 
    !OWNERS.includes(word as Owner) && 
    !PRODUCTS.includes(word as Product) && 
    !amountMatch?.includes(word)
  );
  result.company = nameParts.join(' ');

  return result;
}
