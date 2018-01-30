((($) => {
	'use strict';
	/**
	 * n decorator implementation for the my-cv module.
	 *
	 * @author Pascal Tan <pascal.tan@namics.com>
	 */
	T.Module.MyCv.N = T.createDecorator({
		start(resolve) {
			const $ctx = $(this._ctx);

			this._parent.start(resolve);
		},
	});
})(jQuery));
