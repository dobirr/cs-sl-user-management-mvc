import mongoose from "mongoose";

const User = mongoose.model('User');

/**
 * @description Render create user form
 * @route GET /users/new
 * @access Public
 */
export const renderCreateForm = async (req, res) => {
  res.render('users/create',  {
    title: 'Add new User',
    error: null
  })
};


// Create User (Form submission)

/**
 * @description Handle create user form submission
 * @route POST /users
 * @access Public
 */
export const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = new User({ name, email });
    await newUser.save();

    console.log(`Created new user: ${newUser}`);
    res.redirect('/users');
  } catch (error) {
    console.error('Error creating user: ', error);
    res.render('users/create', {
      title: 'Add new User',
      error: error.message
    });

    // Handle Mongoose validation errors
    if(error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      res.render('users/create', {
        title: 'Add new User',
        error: messages.join(', ')
      });
    }

    // Generic error handling
    res.render('users/create', {
      title: 'Add new User',
      error: 'An error occurred while creating the user. Please try again.'
    });
  }
};

/**
 * @description List all users
 * @route GET /users
 * @access Public
 */
export const listUsers = async (req, res) => {
  try {
    console.log('Fetching users from database...');
    const users = await User.find().sort({createdAt: -1});

    console.log(`Found ${users.length} users.`);

    res.render('users/list', { title: 'User List', users, message: null });
  } catch (error) {
    console.error('Error fetching users: ', error);
    res.render('users/list', { title: 'User List', users: [], message: 'An error occurred while fetching users.' });
  }
};


/**
 * @description Render edit user form
 * @route GET /users/edit/:id
 * @access Public
 */
export const renderEditForm = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(`Fetching user with ID: ${userId} for edit...`);

    const user = await User.findById(userId);

    if (!user) {
      return res.redirect('/users');
    }

    console.log(`User fetched successfully for editing: ${user}`);

    res.render('users/edit', { title: 'Edit User', user, error: null });
  } catch (error) {
    console.error('Error fetching user for edit: ', error.message);
    res.redirect('/users');
  }
};

/**
 * @description Handle Update User form submission
 * @route POST /users/edit/:id
 * @access Public
 */
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email } = req.body;

    console.log(`Updating user with ID: ${userId} with data ${res.body}.`);

    const updatedUser = await User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true });

    if (!updatedUser) {
      console.log('User not found for update');
      return res.redirect('/users');
    }

    console.log(`User updated successfully: ${updatedUser}`);
    res.redirect('/users');
  } catch (error) {
    console.error('Error updating user: ', error.message);

    // Re fetch the user to populate the form with existing data
    let user = await User.findById(req.params.id);

    if(error.code === 1100) { // Handle duplicate key error (e.g., email already exists)
      return res.render('users/edit', {
        title: 'Edit User',
        user: user,
        error: 'Email already exists. Please use a different email.'
      });
    }

    res.render('users/edit', {
      title: 'Edit User',
      user: user,
      error: 'An error occurred while updating the user. Please try again.'
    });
  }
};


/**
 * @description Handle Delete User
 * @route POST /users/delete/:id
 * @access Public
 */
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(`Deleting user with ID: ${userId}.`);

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      console.log(`User with ${userId} not found for deletion`);
      return res.redirect('/users');
    } else {
      console.log(`User deleted successfully: ${deletedUser}`);
    }

    res.redirect('/users');
  } catch (error) {
    console.error('Error deleting user: ', error);
    res.redirect('/users');
  }
};
