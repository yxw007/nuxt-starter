import type { ObjectDirective, DirectiveBinding } from 'vue';

type FlushList = Map<
	HTMLElement,
	{
		bindingFn: (isMouseEnter: boolean, event: MouseEvent) => void,
		enterFn: (event: MouseEvent) => void,
		leaveFn: (event: MouseEvent) => void,
	}
>

const nodeList: FlushList = new Map();

function executeHandler(isMouseEnter: boolean, event: MouseEvent) {
	let target = event.target as HTMLElement;
	for (let [key, value] of nodeList.entries()) {
		//! 说明：如果触发事件target是遍历的元素时就触发调用绑定的方法
		if (key == target) {
			value.bindingFn(isMouseEnter, event);
		}
	}
}

function addListener(el: HTMLElement, enterListener: any, leaveListener: any) {
	el.addEventListener("mouseenter", enterListener);
	el.addEventListener("mouseleave", leaveListener);
}

function delListener(el: HTMLElement, enterListener: any, leaveListener: any) {
	el.removeEventListener("mouseenter", enterListener);
	el.removeEventListener("mouseleave", leaveListener);
}

const HoverEl: ObjectDirective = {
	beforeMount(el: HTMLElement, binding: DirectiveBinding) {
		let options = {
			bindingFn: binding.value,
			enterFn: executeHandler.bind(null, true),
			leaveFn: executeHandler.bind(null, false)
		}
		//! 挂载阶段：
		//! 1.记录设置了指令的元素
		nodeList.set(el, options);
		//! 2.给元素添加移入移出事件
		addListener(el, options.enterFn, options.leaveFn);
	},
	unmounted(el: HTMLElement) {
		let options = nodeList.get(el);
		//! 卸载阶段：
		//! 需要把事件移除掉
		if (options) {
			delListener(el, options.enterFn, options.leaveFn);
		}
		nodeList.delete(el);
	}
}

export { HoverEl }
