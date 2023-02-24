const si = require('systeminformation');
const os = require('node:os');
const uuid = require('uuid');
const path = require('path');
let fs = require('fs/promises');
let DateGenerator = require('random-date-generator');
const process = require('process');

let ComDataPS = {}
let dataPS = {}
let sysPlate = {}
let hardDisk = {}
let PeriferalDevice = []
let updateWindows = []
let software = []
let sosSystem = {}

appendDataUpdate()
appendDataLastUpdate()

valueObject = {
    osInfo: 'arch, release, kernel',
    system: 'manufacturer, sku, serial, model, uuid',
    users: '*',
    diskLayout: 'name, type, serialNum, size, smartData',
    usb: 'type, name, vendor, serialNumber',
    cpu: 'cores, manufacturer, brand, socket, speed',
    baseboard: 'manufacturer, model',
    bios: 'vendor, version, releaseDate',
    versions: '*',
    graphics: '*',
    cpuTemperature: 'main'
}

si.cpuTemperature().then(data => {
    sysPlate.chipset_name = data.chipset
});

si.graphics().then(data => {
    sysPlate.video_adapter_name = data.controllers[0].model
    sysPlate.video_adapter_type = 'internal'
    sysPlate.video_adapter_memory_size = data.controllers[0].vram
});

si.memLayout().then(data => {
    sysPlate.RAM_connector_num = data[0].clockSpeed
    sysPlate.RAM_supported_num = data[0].type 
    sysPlate.RAM_total_amount = data[0].size 
});

si.get(valueObject).then((data) => {
    sosSystem.free_space_sys_disk = data.diskLayout[0].size
    sosSystem.CPU_temperature = data.cpuTemperature.main
    sosSystem.sys_board_temperature = null
    sosSystem.video_adapter_temperature  = null
    sosSystem.each_hard_disk_temperature  = null

    ComDataPS.type_PC = data.system.manufacturer
    ComDataPS.name_PC = os.hostname()
    ComDataPS.inventory_num = data.system.sku
    ComDataPS.serial_num = data.system.serial
    ComDataPS.network_name = data.system.model
    ComDataPS.prod_date = new Date()

    dataPS.name_PC = os.hostname()
    dataPS.OS_bit_dept = data.osInfo.arch
    dataPS.OS_version = data.osInfo.release
    dataPS.OS_versionCore = data.osInfo.kernel
    dataPS.reboot_num = Math.floor(Math.random() * 1000)
    dataPS.install_date = data.bios.releaseDate
    dataPS.local_user_account_num = data.users.length
    dataPS.license_key = data.system.uuid

    hardDisk.hard_disk_name = data.diskLayout[0].name
    hardDisk.hard_disk_type = data.diskLayout[0].type
    hardDisk.hard_disk_serial_num = data.diskLayout[0].serialNum
    hardDisk.hard_disk_capacity = data.diskLayout[0].size
    hardDisk.hard_disk_rotation = Math.floor(Math.random() * 10000)
    hardDisk.registration_num = uuid.v4()
    hardDisk.SMART_data = data.diskLayout[0].name
    sysPlate.board_name = `${data.baseboard.manufacturer} ${data.baseboard.model}`
    sysPlate.socet_type  = data.cpu.socket
    sysPlate.CPU_name  = `${data.cpu.manufacturer} ${data.cpu.brand}`
    sysPlate.CPU_cors_num  = data.cpu.cores
    sysPlate.CPU_clock_speed  = data.cpu.speed
    sysPlate.network_adapter_MAC_address  = os.networkInterfaces()['Беспроводная сеть'][0].mac
    sysPlate.ip_address   = os.networkInterfaces()['Беспроводная сеть'][0].address
    sysPlate.BIOS_type  = data.bios.vendor
    sysPlate.BIOS_version  = data.bios.version

    for (let i = 0; i < Object.keys(data.versions).length; i++) {
        let name = Object.keys(data.versions)[i]
        if (data.versions[name] !== '') {
            let obj = {}
            obj.software_name = name
            obj.software_version = data.versions[name]
            obj.serial_num = ranData()
            software.push(obj)
        }
    }

    data.usb.forEach(el => {
        let obj = {}
        obj.device_type = el.type
        if (el.vendor === null) {
            obj.device_name = `${el.name} undefind`
        } else {
            obj.device_name = `${el.name} ${el.vendor}`
        }
        obj.inventory_num = uuid.v4()
        obj.serial_num = el.serialNumber
        PeriferalDevice.push(obj)
    });

}).then((data) => {
 
    // console.log("Общие данные о пк", ComDataPS);
    // console.log("данные пк", dataPS);
    // console.log("Жёсткие диски", hardDisk);
    // console.log("Системная плата", sysPlate);
    // console.log("Программное обеспечение", software);
    // console.log("Периферийные устройстав", PeriferalDevice);
    // console.log("Обновление виндовс пакетов", updateWindows);
    // console.log("Состояние пк", sosSystem);
}).then(() => {
    let a = JSON.stringify(ComDataPS)
    let b = JSON.stringify(dataPS)
    let c = JSON.stringify(hardDisk)
    let d = JSON.stringify(sysPlate)
    let e = JSON.stringify(software)
    let f = JSON.stringify(PeriferalDevice)
    let g = JSON.stringify(updateWindows)
    let s = JSON.stringify(sosSystem)
    
    fs.appendFile('testFile.txt', a, (err) => {
        if(err) throw err;
        console.log('Data has been added!');
    });
    fs.appendFile('testFile.txt', b, (err) => {
        if(err) throw err;
        console.log('Data has been added!');
    });
    fs.appendFile('testFile.txt', c, (err) => {
        if(err) throw err;
        console.log('Data has been added!');
    });
    fs.appendFile('testFile.txt', d, (err) => {
        if(err) throw err;
        console.log('Data has been added!');
    });
    fs.appendFile('testFile.txt', e, (err) => {
        if(err) throw err;
        console.log('Data has been added!');
    });
    fs.appendFile('testFile.txt', f, (err) => {
        if(err) throw err;
        console.log('Data has been added!');
    });
    fs.appendFile('testFile.txt', g, (err) => {
        if(err) throw err;
        console.log('Data has been added!');
    });
    fs.appendFile('testFile.txt', s, (err) => {
        if(err) throw err;
        console.log('Data has been added!');
    });
})


function appendDataUpdate() {
    let obj = []
    fs.readdir(path.resolve('..', '..', '..', '..', '..', 'Windows', 'SoftwareDistribution', 'Download')).then( (data, resolve, reject) => {
        for(let i =0; i < data.length; i++) {
            let object = {}
            object.update_package_name = data[i]
            obj[i] = object
        }
    }).then(async (data) => {
        for (let i = 0; i < obj.length; i++) {
            await fs.stat(path.resolve('..', '..', '..', '..', '..', 'Windows', 'SoftwareDistribution', 'Download', obj[i].update_package_name)).then( async(datae, resolve, reject) => {
                obj[i].update_package_date = await datae.atime
                if (!sosSystem.last_update_date) {
                    sosSystem.last_update_date = obj[0].update_package_date 
                }
            })
        }
    }).then(async (data) => {
        updateWindows = await obj
    });
}

function appendDataLastUpdate() {
    let obj;
    let res;
    fs.readdir(path.resolve('..', '..', '..', '..', '..', 'Windows', 'System32', 'winevt', 'Logs')).then( (data, resolve, reject) => {
        obj = data[1]
    }).then(async (data) => {
            await fs.stat(path.resolve('..', '..', '..', '..', '..', 'Windows', 'System32', 'winevt', 'Logs')).then( async(datae, resolve, reject) => {
                res = await datae.atime
            })
    }).then(async (data) => {
        sosSystem.sys_fail_registered = await res
    });
}

function ranData() {
    let startDate = new Date(2017, 2, 2);
    let endDate = new Date(2023, 3, 3);
    return DateGenerator.getRandomDateInRange(startDate, endDate);
}

// console.log(updateWindows);
// let ComDataPS1 = {}

// si.system().then(data =>{
//     console.log(os.hostname());
//      ComDataPS1.name_PC = data.model
//      ComDataPS1.serial_num = data.serial
//      ComDataPS1.type_PC = data.manufacturer
// }).then((data) => {
//     console.log(ComDataPS1);
// })


// si.cpu().then(data =>{
//      a = data
// })

// console.log(a);
