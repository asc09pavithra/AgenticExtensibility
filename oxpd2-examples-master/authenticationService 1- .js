import deviceManagementService from "./deviceManagementService.js";
import oxpd2 from 'oxpd2';

const AuthenticationServiceClient = oxpd2.AuthenticationServiceClient;
import errors from './errors.js';
import { AccessTokenType } from "../models/accessTokenType.js";

class AuthenticationService {

constructor(props) {