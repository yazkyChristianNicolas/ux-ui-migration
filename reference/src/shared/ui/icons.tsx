// Un solo punto de entrada para los íconos: cambiar de set o de trazo se hace acá.
// Nunca pasar un componente de ícono de un Server a un Client Component: pasarlo ya renderizado (`<HomeIcon />`).
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  Home,
  Info,
  ListFilter,
  LogOut,
  MoreHorizontal,
  PanelLeft,
  Search,
  SearchX,
  Upload,
  Settings,
  X,
  type LucideProps,
} from "lucide-react";

export type IconComponent = React.ComponentType<LucideProps>;

const withStroke = (Icon: React.ComponentType<LucideProps>) =>
  function StrokedIcon(props: LucideProps) {
    return <Icon strokeWidth={1.75} aria-hidden {...props} />;
  };

export const AlertCircleIcon = withStroke(AlertCircle);
export const CalendarIcon = withStroke(Calendar);
export const CheckIcon = withStroke(Check);
export const CheckCircleIcon = withStroke(CheckCircle2);
export const ChevronDownIcon = withStroke(ChevronDown);
export const ChevronLeftIcon = withStroke(ChevronLeft);
export const ChevronRightIcon = withStroke(ChevronRight);
export const FileCheckIcon = withStroke(FileCheck);
export const HomeIcon = withStroke(Home);
export const InfoIcon = withStroke(Info);
export const ListFilterIcon = withStroke(ListFilter);
export const LogOutIcon = withStroke(LogOut);
export const MoreHorizontalIcon = withStroke(MoreHorizontal);
export const PanelLeftIcon = withStroke(PanelLeft);
export const SearchIcon = withStroke(Search);
export const SearchXIcon = withStroke(SearchX);
export const SettingsIcon = withStroke(Settings);
export const UploadIcon = withStroke(Upload);
export const XIcon = withStroke(X);
