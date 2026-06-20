import * as LucideIcons from "lucide-react";
import { Building2, type LucideProps } from "lucide-react";

interface Props extends LucideProps {
  name?: string | null;
}

const BrancheIcon = ({ name, ...rest }: Props) => {
  const Comp = (name && (LucideIcons as any)[name]) || Building2;
  return <Comp {...rest} />;
};

export default BrancheIcon;