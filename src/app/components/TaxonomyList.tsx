import { sortTaxonomiesWithPrimaryFirst, getPrimaryTaxonomy } from '../lib/taxonomy-utils';

interface TaxonomyNode {
    id: string;
    name: string;
    slug: string;
    isPrimary?: string;
}

interface TaxonomyListProps {
    taxonomies: TaxonomyNode[];
    title: string;
    showPrimaryOnly?: boolean;
    className?: string;
}

export default function TaxonomyList({
    taxonomies,
    title,
    showPrimaryOnly = false,
    className = ""
}: TaxonomyListProps) {
    if (!taxonomies || taxonomies.length === 0) {
        return null;
    }

    // Sort taxonomies with primary items first
    const sortedTaxonomies = sortTaxonomiesWithPrimaryFirst(taxonomies);

    // If showPrimaryOnly is true, only show the primary taxonomy
    const displayTaxonomies = showPrimaryOnly
        ? [getPrimaryTaxonomy(taxonomies)].filter(Boolean) as TaxonomyNode[]
        : sortedTaxonomies;

    return (
        <div className={`taxonomy-list ${className}`}>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">{title}</h3>
            <div className="flex flex-wrap gap-2">
                {displayTaxonomies.map((taxonomy) => (
                    <span
                        key={taxonomy.id}
                        className={`
              inline-block px-3 py-1 text-xs rounded-full border
              ${taxonomy.isPrimary === '1' || taxonomy.isPrimary === 'true'
                                ? 'bg-blue-100 border-blue-300 text-blue-800 font-semibold'
                                : 'bg-gray-100 border-gray-300 text-gray-700'
                            }
            `}
                    >
                        {taxonomy.isPrimary === '1' || taxonomy.isPrimary === 'true' ? '★ ' : ''}
                        {taxonomy.name}
                    </span>
                ))}
            </div>
        </div>
    );
} 