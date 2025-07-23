import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hash, User } from "lucide-react";

interface WorkOrder {
  wo_id: string;
  technician: string | null;
  opco: string | null;
  amm: string | null;
  description: string | null;
  ground_time: number | null;
  man_hours: number | null;
  part_numbers: string | null | number;
  similarity: number;
  issued_date?: string | null;
  closed_date?: string | null;
}

interface WorkOrderCardProps {
  workOrder: WorkOrder;
  rank: number;
}

export function WorkOrderCard({ workOrder, rank }: WorkOrderCardProps) {
  const {
    wo_id,
    technician,
    opco,
    amm,
    description,
    ground_time,
    man_hours,
    part_numbers,
    similarity,
    issued_date,
    closed_date,
  } = workOrder;

  // Format similarity as percentage
  const similarityPercent = Math.round(similarity * 100);

  // Parse part numbers (handle different data types safely)
  const parts = part_numbers
    ? String(part_numbers)
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  // Format dates
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  // Determine similarity level
  const getSimilarityVariant = () => {
    if (similarityPercent >= 80) return "high";
    if (similarityPercent >= 60) return "medium";
    return "low";
  };

  const getSimilarityLabel = () => {
    const variant = getSimilarityVariant();
    if (variant === "high") return "High Similarity";
    if (variant === "medium") return "Medium Similarity";
    return "Low Similarity";
  };

  const getSimilarityBadgeClass = () => {
    const variant = getSimilarityVariant();
    if (variant === "high")
      return "bg-green-100 text-green-800 border-green-200";
    if (variant === "medium")
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <Card className="w-full mb-4 hover:shadow-md transition-shadow">
      <CardContent className="py-4 px-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 pr-4">
            {description || "No description available"}
          </h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className={`px-3 py-1 rounded-full border text-sm font-medium ${getSimilarityBadgeClass()}`}
            >
              {/* {getSimilarityLabel()} */}
              {similarityPercent}% Similarity
            </div>
            {/* <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
              See details
              <span>→</span>
            </button> */}
          </div>
        </div>

        {/* Details Row */}
        <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-300 flex-shrink-0"></div>
            <span>{opco || "Unknown"}</span>
          </div>

          {amm && (
            <>
              <span>ATA: {amm.split("-").slice(0, 2).join("-")}</span>
              <span>AMM Ref.: {amm}</span>
            </>
          )}

          <div className="flex items-center gap-1">
            <Hash className="h-4 w-4" />
            <span>
              {wo_id} {parts.length > 0 && `(${parts.length})`}
            </span>
          </div>
        </div>

        <div className="flex gap-2 justify-between items-center">
          {/* Status Grid */}
          <div className="grid grid-cols-3 gap-8 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Issued</p>
              <p className="font-medium">{formatDate(issued_date)}</p>
            </div>

            <div>
              <p className="text-gray-500 mb-1">Closed</p>
              <p className="font-medium">{formatDate(closed_date)}</p>
            </div>

            <div>
              <p className="text-gray-500 mb-1">Total Hours</p>
              <p className="font-medium">
                {man_hours != null ? `${man_hours}h` : "N/A"}
              </p>
            </div>
          </div>

          {/* Additional Info - Collapsible or Hidden by Default */}
          {(technician || parts.length > 0) && (
            <div>
              {technician && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <User className="h-4 w-4" />
                  <span>Technician: {technician}</span>
                </div>
              )}

              {parts.length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-gray-500 mt-0.5">Parts:</span>
                  <div className="flex flex-wrap gap-1">
                    {parts.slice(0, 3).map((part, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs font-mono px-2 py-0.5"
                      >
                        {part}
                      </Badge>
                    ))}
                    {parts.length > 3 && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        +{parts.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface WorkOrderCardsProps {
  data: {
    query: string;
    total_found: number;
    avg_similarity: number;
    work_orders: WorkOrder[];
  };
}

export function WorkOrderCards({ data }: WorkOrderCardsProps) {
  const { query, total_found, avg_similarity, work_orders } = data;

  return (
    <div className="space-y-4">
      {/* Header with search summary */}
      <div className="bg-muted/30 rounded-lg p-4 border">
        <h3 className="font-semibold text-sm mb-2">Search Results</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Found <span className="font-medium">{total_found}</span> work orders
          similar to: <span className="italic">"{query}"</span>
        </p>
        {avg_similarity > 0 && (
          <p className="text-xs text-muted-foreground">
            Average similarity: {Math.round(avg_similarity * 100)}%
          </p>
        )}
      </div>

      {/* Work Order Cards */}
      <div className="space-y-3">
        {work_orders.map((workOrder, index) => (
          <WorkOrderCard
            key={workOrder.wo_id || index}
            workOrder={workOrder}
            rank={index + 1}
          />
        ))}
      </div>

      {total_found > work_orders.length && (
        <div className="text-center py-2">
          <p className="text-sm text-muted-foreground">
            Showing top {work_orders.length} of {total_found} results
          </p>
        </div>
      )}
    </div>
  );
}
