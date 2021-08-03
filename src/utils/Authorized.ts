import RenderAuthorize from '@/components/Authorized';
import { getAuthority } from './authority';
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/no-mutable-exports */
let Authorized = RenderAuthorize(getAuthority()); /** getAuthority()返回的形式为['admin'] */

// Reload the rights component
const reloadAuthorized = (): void => {
  Authorized = RenderAuthorize(getAuthority());
};

/** Hard code block need it。 */
window.reloadAuthorized = reloadAuthorized;

export { reloadAuthorized };
export default Authorized;
