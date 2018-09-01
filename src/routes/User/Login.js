import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';
import { clearCookie } from '../../utils/formatDataSource';

const { UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  handleSubmit = (err, values) => {
    clearCookie('JSESSIONID');
    const { type } = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  render() {
    const { submitting } = this.props;
    return (
      <div className={styles.main}>
        <Login onSubmit={this.handleSubmit} >
          <UserName name="phone" placeholder="用户名" />
          <Password name="password" placeholder="密码" />
          <Submit loading={submitting}>登录</Submit>
        </Login>
      </div>
    );
  }
}
