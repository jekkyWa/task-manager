import WarningIcon from "@material-ui/icons/Warning";
import { WarningTooltip } from "./tooltip.styles";

const WarningTooltipCustom = ({ type, value, func }) => {
  return (
    <div className={`${type} ${!!value ? "mail-error" : ""}`}>
      <input
        type={type}
        name={type}
        placeholder={`Please enter your ${type}`}
        onChange={func}
      />
      <WarningTooltip
        title={value}
        placement="right"
        className={!!value ? "warning-icon-active" : "warning-icon-block"}
      >
        <WarningIcon
          className="warning-icon-email "
          fontSize="small"
          placement="right"
        />
      </WarningTooltip>
    </div>
  );
};

export default WarningTooltipCustom;
