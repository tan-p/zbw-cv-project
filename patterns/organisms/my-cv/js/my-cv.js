((($) => {
	'use strict';
	/**
	 * my-cv module implementation.
	 *
	 * @author Pascal Tan <pascal.tan@namics.com>
	 */
	T.Module.MyCv = T.createModule({
		start(resolve) {
			const $ctx = $(this._ctx);

			resolve();
		},
	});
})(jQuery));
