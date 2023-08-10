import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // 默认使用localStorage作为持久化存储

import { reducer } from "../reducers/index";

export const store = createStore(reducer, applyMiddleware(thunk));

// // 定义持久化配置
// const persistConfig = {
//   key: "root", // key用于在持久化存储中标识root reducer
//   storage, // 持久化存储引擎
// };

// // 创建持久化reducer
// const persistedReducer = persistReducer(persistConfig, reducer);

// // 创建Redux store
// export const store = createStore(
//   persistedReducer, // 使用持久化reducer
//   applyMiddleware(thunk)
// );

// // 创建持久化persistor，用于处理持久化逻辑
// export const persistor = persistStore(store);
