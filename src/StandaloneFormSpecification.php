<?php

namespace MWStake\MediaWiki\Component\FormEngine;

class StandaloneFormSpecification implements IFormSpecification {

	/** @var array */
	private array $items = [];

	/** @var array */
	private array $buttons = [];

	/**
	 * @param array $items
	 * @return void
	 */
	public function setItems( array $items ) {
		$this->items = $items;
	}

	/**
	 * @param array $buttons
	 * @return void
	 */
	public function setButtons( array $buttons ) {
		$this->buttons = $buttons;
	}

	/**
	 * @return string[]
	 */
	public function getSerialized(): array {
		return [
			'definition' => [
				'items' => $this->items,
				'buttons' => $this->buttons,
			]
		];
	}
}