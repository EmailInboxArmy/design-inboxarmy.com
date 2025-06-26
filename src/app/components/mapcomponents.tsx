interface MapComponentProps {
    mapContent?: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({ mapContent }) => {
    if (!mapContent) {
        return null;
    }

    return (
        <>
            <div className="rounded-2xl overflow-hidden mb-6 map-wrap" dangerouslySetInnerHTML={{ __html: mapContent }}>
            </div>
        </>
    );
};

export default MapComponent; 