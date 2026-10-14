import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test('renders correctly without memory leaks', async () => {
  jest.useFakeTimers();
  let renderer: any;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<App />);
  });

  await ReactTestRenderer.act(() => {
    jest.runOnlyPendingTimers();
    if (renderer) {
      renderer.unmount();
    }
  });

  jest.useRealTimers();
});
