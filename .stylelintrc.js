module.exports = {
    extends: [
        '@zzzz-/stylelint-config-test',
    ],
    overrides: [
        {
            files: ['*.scss', '**/*.scss'],
            rules: {},
        },
        {
            files: ['*.less', '**/*.less'],
            rules: {
                // 禁止未知的伪类选择器。
                // 'selector-pseudo-class-no-unknown': [true, {
                //     // 针对cssModule 进行global忽略
                //     ignorePseudoClasses: ['/^global/'],
                // }],
            },
        },
    ],
    rules: {},
};