export class RoleModel {
  constructor(
    public concurrencyStamp: string,
    public id: string,
    public menuRoles: string[],
    public name: string,
    public persianName: string,
    public normalizedName: string,
    public rDateTime: string,
  ) {}
}
