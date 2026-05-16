import { useSelector, useDispatch } from "react-redux";
import {
  setSearchQuery,
  toggleSelectBm,
  toggleSelectAll,
  setActiveRow,
  setActiveMenu,
  toggleUtility,
  toggleSidebar,
  closeSidebar,
  toggleUtils,
  closeUtils,
} from "../redux/slices/DashboardSlice";
import { menuSections } from "../constants/DashboardData";
import Sidebar from "../component/dashboard/Sidebar";
import TopBar from "../component/dashboard/TopBar";
import BMTable from "../component/dashboard/BMTable";
import UtilitiesPanel from "../component/dashboard/UtilitiesPanel";
import BottomBar from "../component/dashboard/BottomBar";

function Dashboard() {
  const dispatch = useDispatch();

  const bms = useSelector((s: any) => s.dashboard.bms);
  const selectedBmIds = useSelector((s: any) => s.dashboard.selectedBmIds);
  const searchQuery = useSelector((s: any) => s.dashboard.searchQuery);
  const utilities = useSelector((s: any) => s.dashboard.utilities);
  const activeMenu = useSelector((s: any) => s.dashboard.activeMenu);
  const activeRowId = useSelector((s: any) => s.dashboard.activeRowId);
  const sidebarOpen = useSelector((s: any) => s.dashboard.sidebarOpen);
  const utilsOpen = useSelector((s: any) => s.dashboard.utilsOpen);

  const filteredBms = searchQuery
    ? bms.filter(
        (b: any) =>
          b.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.bmId.includes(searchQuery)
      )
    : bms;

  return (
    <div className="h-screen w-screen flex bg-gray-50 text-gray-900 overflow-hidden">
      <Sidebar
        sections={menuSections}
        activeMenu={activeMenu}
        isOpen={sidebarOpen}
        onSelectMenu={(id) => dispatch(setActiveMenu(id))}
        onClose={() => dispatch(closeSidebar())}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          searchQuery={searchQuery}
          onSearchChange={(q) => dispatch(setSearchQuery(q))}
          onOpenSidebar={() => dispatch(toggleSidebar())}
          onOpenUtils={() => dispatch(toggleUtils())}
        />

        <div className="flex-1 flex min-h-0">
          <BMTable
            bms={filteredBms}
            selectedIds={selectedBmIds}
            activeRowId={activeRowId}
            onToggleSelect={(id) => dispatch(toggleSelectBm(id))}
            onToggleSelectAll={() => dispatch(toggleSelectAll())}
            onSelectRow={(id) => dispatch(setActiveRow(id))}
          />

          <UtilitiesPanel
            utilities={utilities}
            isOpen={utilsOpen}
            onToggle={(id) => dispatch(toggleUtility(id))}
            onClose={() => dispatch(closeUtils())}
          />
        </div>

        <BottomBar
          total={bms.length}
          selected={selectedBmIds.length}
          region={filteredBms.length}
        />
      </div>
    </div>
  );
}

export default Dashboard;
