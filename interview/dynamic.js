import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { IntlProvider, injectIntl } from 'react-intl';

const IntlMap = {
  zh_CN: 'zh',
  zh_HK: 'zh',
  en_US: 'en',
  th_TH: 'th',
};

@connect(({ global }) => ({ global }))
export class DynamicWrapperIntl extends PureComponent {
  state = {
    data: null,
  };

  componentDidMount() {
    this.resolveImport();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.global.langs !== this.props.global.langs) {
      this.resolveImport();
    }
  }

  resolveImport = () => {
    const { global: { langs = 'zh_CN' }, name } = this.props;
    if (typeof name === 'string') {
      import(`../../locale/${langs}/${name}`)
        .then(m => {
          // console.log('DynamicWrapperIntl:', m.default);
          this.setState({
            data: m.default,
          });
        })
        .catch(e => {
          console.log('DynamicWrapperIntl:', e);
        });
    } else if (name instanceof Array) {
      Promise.all(name.map(i => import(`../../locale/${langs}/${i}`)))
        .then(m => {
          const data = m.reduce((acc, cur) => {
            acc = {
              ...acc,
              ...cur.default,
            };
            return acc;
          }, {});
          this.setState({
            data,
          });
        })
        .catch(e => {
          console.log('DynamicWrapperIntl:', e);
        });
    }
  };

  render() {
    const { global: { langs = 'zh_CN' } } = this.props;
    const { data } = this.state;

    return (
      <Fragment>
        {data && (
          <IntlProvider locale={IntlMap[langs]} messages={data}>
            {this.props.children({
              langs,
              locales: data,
            })}
          </IntlProvider>
        )}
      </Fragment>
    );
  }
}

export const withDynamicWrapperIntl = (name, setting = {}) => WrapperComponent => {
  const Wrapper = withInjectIntl(setting)(WrapperComponent);
  return class DynamicWrapperIntlHoc extends PureComponent {
    render() {
      return (
        <DynamicWrapperIntl name={name}>
          {wrapperProps => <Wrapper {...this.props} {...wrapperProps} />}
        </DynamicWrapperIntl>
      );
    }
  };
};

export function DynamicFormatMessage({ names, ...otherProps }) {
  const DynamicIntl = withDynamicWrapperIntl(names)(props => {
    const { intl: { formatMessage }, id, values } = props;
    return formatMessage({ id }, values);
  });
  return <DynamicIntl {...otherProps} />;
}

export const withInjectIntl = (setting = {}) => WrapperComponent => {
  const WrapperComponentWithRef = ({ forwardRef, ...otherProps }) => (
    <WrapperComponent {...otherProps} {...(forwardRef ? { ref: forwardRef } : {})} />
  );
  return injectIntl(WrapperComponentWithRef, setting);
};

export { FormattedMessage } from 'react-intl';
