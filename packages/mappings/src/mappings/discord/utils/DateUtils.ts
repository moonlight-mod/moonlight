import type { IntlMessageGetter } from "@discord/intl";
import { ModuleExportType } from "@moonlight-mod/moonmap";
import type { Moment } from "moment";
import register from "../../../registry";

interface Units {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
interface StringUnits {
  days: IntlMessageGetter;
  hours: IntlMessageGetter;
  minutes: IntlMessageGetter;
}

type Exports = {
  differenceInCalendarDays: (now: Date, then: Date) => number;
  differenceInDays: (now: Date, then: Date) => number;
  isSameDay: (a: Date, b: Date) => boolean;
  isWithinInterval: (now: Date, then: Date, interval: number) => boolean;
  dateFormat: (date: Date | Moment, format: string, timestampHourCycleOverride?: any) => string;
  calendarFormat: (date: Date | Moment, relative?: boolean, timestampHourCycleOverride?: any) => string;
  calendarFormatCompact: (date: Date | Moment, timestampHourCycleOverride?: any) => string;
  //dateStringToMoment: (str: string) => Moment;
  accessibilityLabelCalendarFormat: (date: Date | Moment) => string;
  diffAsUnits: (then: Date | number, now: Date | number, oneSec?: boolean) => Units;
  unitsAsStrings: (units: Units, strings: StringUnits) => string;
  //getESTDate: () => Date;
  getMonthlyProgressPercentage: () => number;
  getDaysRemainingInMonth: () => number;
  formatDateForDatetimeLocal: (date: Date | Moment) => string;
};
export default Exports;

register((moonmap) => {
  const name = "discord/utils/DateUtils";
  moonmap.register({
    name,
    find: '("DateUtils")',
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "differenceInCalendarDays", {
        type: ModuleExportType.Function,
        find: "return Math.floor("
      });
      moonmap.addExport(name, "differenceInDays", {
        type: ModuleExportType.Function,
        find: ".getTime())/864e5"
      });
      moonmap.addExport(name, "isSameDay", {
        type: ModuleExportType.Function,
        find: "return 864e5>=Math.abs("
      });
      moonmap.addExport(name, "isWithinInterval", {
        type: ModuleExportType.Function,
        find: "return Math.abs("
      });
      moonmap.addExport(name, "dateFormat", {
        type: ModuleExportType.Function,
        find: ".getSetting()}`"
      });
      moonmap.addExport(name, "calendarFormat", {
        type: ModuleExportType.Function,
        find: '<2?"nextDay":"sameElse";'
      });
      moonmap.addExport(name, "calendarFormatCompact", {
        type: ModuleExportType.Function,
        find: '.calendar("lastDay",'
      });
      // inlined into formatDateForDatetimeLocal
      /*moonmap.addExport(name, "dateStringToMoment", {
        type: ModuleExportType.Function,
        find: 'throw Error("Date string exceeds maximum length")'
      });*/
      moonmap.addExport(name, "accessibilityLabelCalendarFormat", {
        type: ModuleExportType.Function,
        find: ',"LLL"):'
      });
      moonmap.addExport(name, "diffAsUnits", {
        type: ModuleExportType.Function,
        find: ".forEach("
      });
      moonmap.addExport(name, "unitsAsString", {
        type: ModuleExportType.Function,
        find: ".intl.formatToPlainString"
      });
      // treeshaken on web
      /*moonmap.addExport(name, "getESTDate", {
        type: ModuleExportType.Function,
        find: 'timeZone:"America/New_York"'
      });*/
      moonmap.addExport(name, "getMonthlyProgressPercentage", {
        type: ModuleExportType.Function,
        find: ".getMonth()+1,0).getDate()-"
      });
      moonmap.addExport(name, "getDaysRemainingInMonth", {
        type: ModuleExportType.Function,
        find: ".getMonth()+1,0).getDate();"
      });
      moonmap.addExport(name, "formatDateForDatetimeLocal", {
        type: ModuleExportType.Function,
        find: '.format("YYYY-MM-DDTHH:mm")'
      });

      return true;
    }
  });
});
