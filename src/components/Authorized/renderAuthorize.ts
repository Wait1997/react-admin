/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/no-mutable-exports */
let CURRENT: string | string[] = 'NULL';

type CurrentAuthorityType = string | string[] | (() => typeof CURRENT);
/**
 * Use authority or getAuthority
 *
 * @param {string|()=>String} currentAuthority
 * @returns {(currentAuthority: CurrentAuthorityType)=> T} 返回函数
 */
const renderAuthorize =
  <T>(Authorized: T): ((currentAuthority: CurrentAuthorityType) => T) =>
  (currentAuthority: CurrentAuthorityType): T => {
    if (currentAuthority) {
      if (typeof currentAuthority === 'function') {
        CURRENT = currentAuthority();
      }
      if (
        Object.prototype.toString.call(currentAuthority) === '[object String]' ||
        Array.isArray(currentAuthority)
      ) {
        CURRENT = currentAuthority as string[];
      }
    } else {
      CURRENT = 'NULL';
    }
    return Authorized;
  };

// function renderAuthorize<T>(Authorized: T): (currentAuthority: CurrentAuthorityType) => T {
//   return (currentAuthority: CurrentAuthorityType): T => {
//     if (currentAuthority) {
//       if (typeof currentAuthority === 'function') {
//         CURRENT = currentAuthority();
//       }
//       if (
//         Object.prototype.toString.call(currentAuthority) === '[object String]' ||
//         Array.isArray(currentAuthority)
//       ) {
//         CURRENT = currentAuthority as string[];
//       }
//     } else {
//       CURRENT = 'NULL';
//     }
//     return Authorized;
//   };
// }

export { CURRENT };
// T是一个组件
export default <T>(Authorized: T) => renderAuthorize<T>(Authorized);
