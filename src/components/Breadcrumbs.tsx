import { Link, useLocation } from "react-router-dom";
import { ChevronRight, PanelLeft } from "lucide-react";

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const getBreadcrumbLabel = (path: string) => {
    switch (path) {
      case "universe-definition":
        return "Universe Definition";
      default:
        // Capitalize and replace hyphens with spaces
        return path
          .charAt(0).toUpperCase() + path.slice(1)
          .replace(/-/g, " ");
    }
  };

  return (
    <div className="flex items-center gap-3 px-8 py-3.5 border-b border-gray-200 bg-slate-50 sticky top-0 bg-opacity-95 backdrop-blur z-10">
      <PanelLeft className="w-4 h-4 text-gray-500 cursor-pointer" />
      <div className="w-px h-3.5 bg-gray-300 mx-1" />
      <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
        Dashboard
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        return (
          <div key={routeTo} className="flex items-center gap-3">
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            {isLast ? (
              <span className="text-sm font-medium text-gray-900">
                {getBreadcrumbLabel(name)}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                {getBreadcrumbLabel(name)}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
