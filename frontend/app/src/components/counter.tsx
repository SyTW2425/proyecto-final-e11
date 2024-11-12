// src/components/Counter.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { increment, decrement } from '../redux/exampleReducer';

const Counter: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const value = useSelector((state: RootState) => state.example.value);

  return (
    <div>
      <h1>Counter: {value}</h1>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
};

export default Counter;
