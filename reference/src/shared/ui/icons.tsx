// Un solo punto de entrada para los íconos: cambiar de set o de trazo se hace acá.
// Nunca pasar un componente de ícono de un Server a un Client Component: pasarlo ya renderizado (`<HomeIcon />`).
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Home,
  ListFilter,
  LogOut,
  MoreHorizontal,
  PanelLeft,
  Search,
  SearchX,
  Settings,
  X,
  type LucideProps,
} from "lucide-react";

const withStroke = (Icon: React.ComponentType<LucideProps>) =>
  function StrokedIcon(props: LucideProps) {
    return <Icon strokeWidth={1.75} aria-hidden {...props} />;
  };

export const AlertCircleIcon = withStroke(AlertCircle);
export const ChevronLeftIcon = withStroke(ChevronLeft);
export const ChevronRightIcon = withStroke(ChevronRight);
export const HomeIcon = withStroke(Home);
export const ListFilterIcon = withStroke(ListFilter);
export const LogOutIcon = withStroke(LogOut);
export const MoreHorizontalIcon = withStroke(MoreHorizontal);
export const PanelLeftIcon = withStroke(PanelLeft);
export const SearchIcon = withStroke(Search);
export const SearchXIcon = withStroke(SearchX);
export const SettingsIcon = withStroke(Settings);
export const XIcon = withStroke(X);
