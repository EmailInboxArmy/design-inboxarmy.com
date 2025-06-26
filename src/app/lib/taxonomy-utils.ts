interface TaxonomyNode {
    id: string;
    name: string;
    slug: string;
    isPrimary?: string;
}

/**
 * Sorts taxonomy nodes with primary items first
 * @param taxonomies Array of taxonomy nodes
 * @returns Sorted array with primary items first, then alphabetical
 */
export function sortTaxonomiesWithPrimaryFirst(taxonomies: TaxonomyNode[]): TaxonomyNode[] {
    return taxonomies.sort((a, b) => {
        // Convert isPrimary to boolean for comparison
        const aPrimary = a.isPrimary === '1' || a.isPrimary === 'true';
        const bPrimary = b.isPrimary === '1' || b.isPrimary === 'true';

        // Primary items come first
        if (aPrimary && !bPrimary) return -1;
        if (!aPrimary && bPrimary) return 1;

        // If both are primary or both are not primary, sort alphabetically
        return a.name.localeCompare(b.name);
    });
}

/**
 * Gets the primary taxonomy from a list
 * @param taxonomies Array of taxonomy nodes
 * @returns The first primary taxonomy or null if none found
 */
export function getPrimaryTaxonomy(taxonomies: TaxonomyNode[]): TaxonomyNode | null {
    return taxonomies.find(tax => tax.isPrimary === '1' || tax.isPrimary === 'true') || null;
}

/**
 * Filters taxonomies to only show primary ones
 * @param taxonomies Array of taxonomy nodes
 * @returns Array containing only primary taxonomies
 */
export function filterPrimaryTaxonomies(taxonomies: TaxonomyNode[]): TaxonomyNode[] {
    return taxonomies.filter(tax => tax.isPrimary === '1' || tax.isPrimary === 'true');
} 