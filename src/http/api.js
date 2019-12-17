/*
 * 接口统一集成模块
 */
import * as login from './moudules/login'
import * as user from './moudules/user'
import * as dept from './moudules/dept'
import * as role from './moudules/role'
import * as menu from './moudules/menu'
import * as dict from './moudules/dict'
import * as log from './moudules/log'
import * as order from './moudules/order'
import * as check from './moudules/check'
import * as parts from './moudules/parts'
import * as stock from './moudules/stock'
import * as access from './moudules/access'
import * as customer from './moudules/customer'
import * as help from './moudules/help'
import * as unqu from './moudules/unqu'



// 默认全部导出
export default {
    login,
    user,
    dept,
    role,
    menu,
    dict,
    log,
	order,
	check,
	parts,
	stock,
	access,
	customer,
	help,
	unqu
}
