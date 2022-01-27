"use strict";

/*
|--------------------------------------------------------------------------
| InsertEmployeeLevelSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const jabatan = use("App/Models/Karyawan/Jabatan");

class InsertEmployeeRolesSeeder {
  async run () {
    const data = [
      {
        name: "Unsigned",
        isOffice: false,
      },
      {
        name: "Owner",
        isOffice: true,
        isOwner: true,
      },
      {
        name: "Head Office",
        isOffice: true,
      },
      {
        name: "Sales",
        isOffice: true,
      },
      {
        name: "Tukang Las",
        isOffice: false,
      },
      {
        name: "Finishing",
        isOffice: false,
      },
      {
        name: "Tukang Anyam",
        isOffice: false,
      },
      {
        name: "Multiplex",
        isOffice: false,
      },
    ];
    await jabatan.createMany(data);
  }
}

module.exports = InsertEmployeeRolesSeeder;
