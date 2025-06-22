
import { CheckCircle, AlertTriangle, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const SensitivityLegend = () => {
  return (
    <Card className="mb-4 border-0 shadow-sm bg-white/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-slate-800">Sensitivity Indicators:</h3>
          <div className="flex space-x-4">
            <Badge className="bg-green-100 text-green-800 border-green-300">
              <CheckCircle className="w-3 h-3 mr-1" />
              Safe
            </Badge>
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Sensitive
            </Badge>
            <Badge className="bg-red-100 text-red-800 border-red-300">
              <Shield className="w-3 h-3 mr-1" />
              High Risk
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
