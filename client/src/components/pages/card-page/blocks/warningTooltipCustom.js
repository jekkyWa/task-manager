import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { WarningTooltip } from "./tooltip.styles";

const WarningTooltipCustom = ({ value }) => {
  const validValue = value ? `Roles: ${value}` : "Roles are not selected";
  return (
    <WarningTooltip title={validValue} placement="top">
      <ErrorOutlineIcon className="selected-roles-help-icon" />
    </WarningTooltip>
  );
};

export default WarningTooltipCustom;
