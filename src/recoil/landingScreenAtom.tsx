import {atom} from 'recoil';

export const landingScreenAtom = atom<boolean>({
  key: 'landingScreen',
  default: false,
});
