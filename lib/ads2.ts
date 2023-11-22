import apiService from './apiService';

async function addAds2(channels: any) {
  const ads = await apiService.getAds2();

  const getRandomIndex = (max: any) => Math.floor(Math.random() * (max + 1));

  let newArray = channels;

  // Remove items from the end of the main array based on the length of the additional array
  if (channels.length > ads.length) {
    newArray = channels.slice(0, channels.length - ads.length);
  }

  // Insert the additional array into random positions in the new array
  ads.forEach((item: any) => {
    const randomIndex = getRandomIndex(newArray.length > 45 ? 45 : newArray.length);
    newArray.splice(randomIndex, 0, item);
  });

  return newArray;
}

export default addAds2;
