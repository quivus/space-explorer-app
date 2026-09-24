import { Href } from 'expo-router';

let arriveFromLanding = false;

export function beginExplore() {
  arriveFromLanding = true;
}

export function consumeExploreArrival() {
  const arriving = arriveFromLanding;
  arriveFromLanding = false;
  return arriving;
}

export function detailsHref(id: string): Href {
  return { pathname: '/details/[id]', params: { id } };
}
