import { SimpleAdapter } from "../../adapters/types";
import { getUniqStartOfTodayTimestamp } from "../../helpers/getUniSubgraphVolume";
import fetchURL from "../../utils/fetchURL"

const historicalVolumeEndpoint = "https://ss.meshswap.fi/stat/dashboardInfo.json"

interface IVolume {
  dateId: string;
  amount: number;
};

const fetch = async (timestamp: number) => {
  const dayTimestamp = getUniqStartOfTodayTimestamp(new Date(timestamp * 1000))
  const historicalVolume: IVolume[] = (await fetchURL(historicalVolumeEndpoint))?.data?.dayVolume;
  const totalVolume = historicalVolume
    .filter(volItem => (new Date(volItem.dateId).getTime() / 1000) <= dayTimestamp)
    .reduce((acc, { amount }) => acc + Number(amount), 0)

  const dailyVolume = historicalVolume
    .find(dayItem => (new Date(dayItem.dateId).getTime() / 1000) === dayTimestamp)?.amount

  return {
    totalVolume: `${totalVolume -7885989841413.129}`,
    dailyVolume: dailyVolume ? `${dailyVolume}` : undefined,
    timestamp: dayTimestamp,
  };
};

const getStartTimestamp = async () => {
  const historicalVolume: IVolume[] = (await fetchURL(historicalVolumeEndpoint))?.data?.dayVolume;
  return (new Date(historicalVolume[0].dateId).getTime()) / 1000
}

const adapter: SimpleAdapter = {
  adapter: {
    polygon: {
      fetch,
      start: getStartTimestamp,
    },
  },
};

export default adapter;
