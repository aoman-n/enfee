import AxiosFactory from 'utils/axios';
import { TimeoutError, ServerError } from 'src/utils/errors';
import { UserProfile, Review } from 'services/models';

const axios = AxiosFactory.getInstance();

export const fetchMyProfile = async (token: string) => {
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const response = await axios.get('/users/me', {
      headers,
    });

    if (response.status !== 200) {
      throw new ServerError('server error');
    }
    const result: UserProfile = response.data;

    return result;
  } catch (err) {
    if (err.message.startsWith('timeout')) {
      throw new TimeoutError('timeout error');
    }

    if (err instanceof ServerError) {
      throw new ServerError(err.message);
    }

    throw new Error(`unexpected error${err}`);
  }
};

export const fetchUserProfileApi = async (
  loginName: string,
): Promise<UserProfile> => {
  try {
    const response = await axios.get<{ data: UserProfile }>(`/users/${loginName}`);

    return response.data;
  } catch (err) {
    throw err;
  }
};

export type UsersKind = 'followers' | 'following';

export const fetchUsersApi = async (
  loginName: string,
  target: UsersKind,
): Promise<UserProfile[]> => {
  try {
    const response = await axios.get<{ data: UserProfile[] }>(
      `/users/${loginName}/${target}`,
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchReviewsApi = async (loginName: string): Promise<Review[]> => {
  try {
    const response = await axios.get<{ data: Review[] }>(
      `/users/${loginName}/reviews`,
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
