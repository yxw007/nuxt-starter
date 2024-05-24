
import type { ObjectDirective, DirectiveBinding } from 'vue';
import { isClient } from '@vueuse/core'


type DocumentHandler = <T extends MouseEvent>(mouseup: T, mousedown: T) => void
type FlushList = Map<
	HTMLElement,
	{
		documentHandler: DocumentHandler
		bindingFn: (...args: unknown[]) => unknown
	}
>

const nodeList: FlushList = new Map()
//! 记录点击的开始事件对象
let startClick: MouseEvent;

if (isClient) {
	//! 点击事件绑定在document上
	document.addEventListener('mousedown', (e: MouseEvent) => (startClick = e))
	document.addEventListener('mouseup', (e: MouseEvent) => {
		for (const handler of nodeList.values()) {
			const { documentHandler } = handler;
			documentHandler(e as MouseEvent, startClick)
		}
	});
}

function createDocumentHandler(
	el: HTMLElement,
	binding: DirectiveBinding
): DocumentHandler {
	let excludes: HTMLElement[] = []
	if (Array.isArray(binding.arg)) {
		excludes = binding.arg
	} else if (isElement(binding.arg)) {
		excludes.push(binding.arg as unknown as HTMLElement)
	}

	//! 事件处理
	return function (mouseup, mousedown) {
		const mouseUpTarget = mouseup.target as Node
		const mouseDownTarget = mousedown?.target as Node
		const isContainedByEl =
			el.contains(mouseUpTarget) || el.contains(mouseDownTarget);
		const isSelf = el === mouseUpTarget;
		//! 如果点击是父容器元素 or 元素本身不触发事件，否则：就是点击元素外面了，需要抛事件
		if (isContainedByEl || isSelf) {
			return;
		}
		binding.value(mouseup, mousedown);
	}
}

const ClickOutside: ObjectDirective = {
	beforeMount(el: HTMLElement, binding: DirectiveBinding) {
		//! 挂载阶段：
		//! 记录设置了指令的元素 && 给元素绑定事件
		nodeList.set(el, {
			documentHandler: createDocumentHandler(el, binding),
			bindingFn: binding.value,
		});
	},
	unmounted(el: HTMLElement) {
		//! 卸载阶段：
		//! 需要把元素移除
		nodeList.delete(el)
	}
}


export { ClickOutside }
