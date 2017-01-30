import { renderComponent , expect } from '../test_helper';
import StormDash from '../../src/components/stormdash';

describe('StormDash' , () => {
  let component;

  beforeEach(() => {
    component = renderComponent(StormDash);
  });

  it('renders something', () => {
    expect(component).to.exist;
  });
});
