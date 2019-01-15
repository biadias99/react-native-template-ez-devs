import { createActions, handleActions } from 'redux-actions';
import {
  all,
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';

import { createCommonActions, handleCommonActions } from './common';
import api from '../services/api';

export const actions = {
  ...createActions({
    CLEAR_ALL: undefined,
    SET_DUCKS: undefined,
    ...createCommonActions('LOAD_DUCKS'),
  }),
};

function* loadDucksWatcher() {
  yield takeLatest(actions.loadDucks().type, function* loadDucks() {
    try {
      yield put(actions.loadDucksStarted());

      const { data } = yield call(api().get);

      yield put(actions.setDucks(data));

      yield call(actions.loadDucksSucceeded);
    } catch (e) {
      const message = `Erro ao carregar duck: ${e.message}`;
      console.log(message);

      yield put(actions.loadDucksFailed(e.code, message));
    }
  });
}

export function* sagas() {
  yield all([
    loadDucksWatcher(),
  ]);
}

const defaultState = {
  status: {
    code: 0,
    message: '',
  },
  data: [],
  selected: undefined,
};

export default handleActions({
  CLEAR_ALL: () => defaultState,
  SET_DUCKS: (state, { payload = [] }) => ({
    ...state,
    data: payload
  }),
  ...handleCommonActions('LOAD_DUCKS'),
}, defaultState);

export const getStatus = ({ duck }) => duck.status;
export const getDucks = ({ duck }) => duck.data;
