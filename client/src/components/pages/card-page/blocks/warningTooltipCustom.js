import HelpIcon from "@material-ui/icons/Help";
import { WarningTooltip } from "./tooltip.styles";

const WarningTooltipCustom = ({ value, handlerTitleCard }) => {
  const validValue = value ? `Roles: ${value}` : "Roles are not selected";
  return (
    <WarningTooltip title={validValue} placement="top">
      <HelpIcon
        className={
          value.length > 0
            ? "selected-roles-help-icon-enabled"
            : "selected-roles-help-icon-disabled"
        }
      />
    </WarningTooltip>
  );
};

export default WarningTooltipCustom;
