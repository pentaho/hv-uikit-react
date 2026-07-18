/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import { ActiveUsers } from "./cards/ActiveUsers";
import { ApiUsage } from "./cards/ApiUsage";
import { DataConfig } from "./cards/DataConfig";
import { DataInsights } from "./cards/DataInsights";
import { DataProcessing } from "./cards/DataProcessing";
import { DataSecurity } from "./cards/DataSecurity";
import { FinancialPerformance } from "./cards/FinancialPerformance";
import { StorageOverview } from "./cards/StorageOverview";
import { TeamOverview } from "./cards/TeamOverview";

export const CardsSection = () => {
  return (
    <div className="grid grid-cols-[320px_320px_320px] gap-md p-md mx-auto">
      <div className="space-y-4">
        <DataInsights />
        <DataConfig />
      </div>
      <div className="space-y-4">
        <FinancialPerformance />
        <StorageOverview />
        <ActiveUsers />
        <DataProcessing />
      </div>
      <div className="space-y-4">
        <ApiUsage />
        <DataSecurity />
        <TeamOverview />
      </div>
    </div>
  );
};
